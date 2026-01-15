import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const BRANCH_MAP: Record<string, string> = {
    'Wrocław': 'ea64d547-03e1-477c-b480-2a7f5166f9dd',
    'Katowice': '07168534-44eb-45e6-9818-9a4be9fe926c',
    'Legnica': '501c25bc-07ae-40f1-8b0e-c7ccd58e1660',
    'Jelenia Góra': 'b7ce6a6d-227b-4f7c-b2af-7cdf9a2492c7',
}

const CSV_PATH = path.join(process.cwd(), 'Art-Tim_Baza_Samochodo_w_-_Produkcja_-_Samochody.csv')

function parseDate(dateStr: string): string | null {
    if (!dateStr) return null
    const [day, month, year] = dateStr.trim().split('.')
    if (!day || !month || !year) return null
    return `${year}-${month}-${day}`
}

function parseBool(val: string): boolean {
    return val?.toLowerCase() === 'tak'
}

function parseIntSafe(val: string): number | null {
    if (!val) return null
    const parsed = parseInt(val.replace(/\s/g, ''), 10)
    return isNaN(parsed) ? null : parsed
}

async function migrate() {
    console.log('Reading CSV...')
    const fileContent = fs.readFileSync(CSV_PATH, 'utf-8')
    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    })

    console.log(`Found ${records.length} records. Processing...`)

    const vehicles = records.map((record: any) => {
        const plate = record['NR REJ']
        if (!plate) return null

        const branchId = BRANCH_MAP[record['MIASTO']] || null

        return {
            plate_number: plate,
            brand: record['MARKA'],
            model: record['MODEL'],
            production_year: parseIntSafe(record['ROK PRODUKCJI']),
            engine_capacity: parseIntSafe(record['POJEMNOŚĆ']),
            load_capacity: parseIntSafe(record['ŁADOWNOŚĆ']),
            next_inspection_date: parseDate(record['TERMIN NASTĘPNEGO PRZEGLĄDU']),
            next_insurance_date: parseDate(record['TERMIN NASTĘPNEJ POLISY']),
            branch_id: branchId,
            is_airport: record['LOTNISKO'] && record['LOTNISKO'].toLowerCase() !== 'nie', // Assuming 'Nie' is false, anything else might be true or location? Assuming Bool for now based on 'Nie' in sample
            is_leasing: parseBool(record['LEASING']),
            leasing_company: record['NAZWA LEASINGU'],
            leasing_end_date: parseDate(record['ZAKOŃCZENIE UMOWY LEASINGU']),
            inspection_document_url: record['PRZEGLĄD DOKUMENT'],
            insurance_document_url: record['POLISA DOKUMNET'],
            is_active: true,
        }
    }).filter((r: any) => r !== null)

    console.log(`Parsed ${vehicles.length} valid vehicles. Upserting to Supabase...`)

    // Upsert in batches of 50 to avoid payload limits
    const BATCH_SIZE = 50
    for (let i = 0; i < vehicles.length; i += BATCH_SIZE) {
        const batch = vehicles.slice(i, i + BATCH_SIZE)
        console.log(`Upserting batch ${i / BATCH_SIZE + 1}...`)

        // We explicitly specify onConflict to use 'plate_number' which has a unique constraint
        const { error } = await supabase.from('vehicles').upsert(batch, { onConflict: 'plate_number' })

        if (error) {
            console.error(`Error inserting batch starting at index ${i}:`, error)
        } else {
            console.log(`Batch ${i / BATCH_SIZE + 1} done.`)
        }
    }

    console.log('Migration completed.')
}

migrate()
