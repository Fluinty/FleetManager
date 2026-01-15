import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { subDays, format } from 'date-fns'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // or SERVICE_ROLE if RLS blocks basic writes

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
    console.log('Fetching vehicles...')
    const { data: vehicles } = await supabase
        .from('vehicles')
        .select('id, plate_number, branch_id')
        .eq('is_active', true)

    if (!vehicles || vehicles.length === 0) {
        console.error('No vehicles found. Seed vehicles first.')
        return
    }

    console.log(`Found ${vehicles.length} vehicles. Generating orders...`)

    const orders = []
    const orderItems = []

    // Generate 50 orders over last 6 months
    for (let i = 0; i < 50; i++) {
        const randomVehicle = vehicles[Math.floor(Math.random() * vehicles.length)]
        const daysAgo = Math.floor(Math.random() * 180)
        const orderDate = subDays(new Date(), daysAgo)
        const orderId = crypto.randomUUID()
        const intercarsId = `${Math.floor(Math.random() * 10000)}/KTW/2025`

        const amount = Math.floor(Math.random() * 500) + 50 // 50 - 550 PLN

        orders.push({
            id: orderId,
            intercars_id: intercarsId,
            vehicle_id: randomVehicle.id,
            branch_code: 'KTW', // Assumption
            total_net: (amount / 1.23).toFixed(2),
            total_gross: amount,
            order_date: orderDate.toISOString(),
            raw_comment: `Seed data for ${randomVehicle.plate_number}`,
            extracted_plate: randomVehicle.plate_number,
            plate_extraction_status: 'matched',
            resolved: true
        })

        // Add 1-3 items per order
        const itemCount = Math.floor(Math.random() * 3) + 1
        for (let j = 0; j < itemCount; j++) {
            orderItems.push({
                order_id: orderId,
                sku: `ITEM-${Math.floor(Math.random() * 1000)}`,
                name: `Część zamienna ${j + 1}`,
                description: 'Generated item',
                packaged_quantity: 1,
                unit_price_gross: (amount / itemCount).toFixed(2),
                total_gross: (amount / itemCount).toFixed(2)
            })
        }
    }

    console.log(`Inserting ${orders.length} orders...`)
    const { error: matchError } = await supabase.from('orders').upsert(orders)
    if (matchError) console.error('Error inserting orders:', matchError)
    else console.log('Orders inserted.')

    console.log(`Inserting ${orderItems.length} items...`)
    const { error: itemError } = await supabase.from('order_items').upsert(orderItems)
    if (itemError) console.error('Error inserting items:', itemError)
    else console.log('Items inserted.')

    console.log('Seed complete!')
}

seed()
