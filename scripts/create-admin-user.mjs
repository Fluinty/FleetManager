// Script to create Admin user
const SUPABASE_URL = 'https://bsqibeirdfjdphpyqnlx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Cj9NP8WIAzw0f0l-r-jLLQ_xU-6IIvN';

async function createAdminUser() {
    try {
        // Try to sign up the user
        // Note: Password must be at least 6 chars, so using 'admin123' instead of 'admin'
        const signupResponse = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'baza.arttim@gmail.com',
                password: 'admin123',
            }),
        });

        const result = await signupResponse.json();

        if (signupResponse.ok) {
            console.log('✅ Użytkownik utworzony!');
            console.log('User ID:', result.user?.id);

            if (result.user?.id) {
                // Now add the profile with admin role
                const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation',
                    },
                    body: JSON.stringify({
                        id: result.user.id,
                        role: 'admin',
                        // No branch_id for admin
                    }),
                });

                if (profileResponse.ok) {
                    console.log('✅ Profil administratora dodany');
                } else {
                    const profileError = await profileResponse.json();
                    console.log('⚠️ Błąd dodawania profilu:', profileError);

                    // If profile fails (e.g. RLS), we might need to insert via SQL query in the chat
                    // But usually for signup it might work if RLS allows self-insert or if we use service key (which we don't have easily accessible in this context without user input, but better to try this first)
                }
            }
        } else {
            console.log('❌ Błąd rejestracji:', result.error_description || result.msg || JSON.stringify(result));
        }
    } catch (error) {
        console.error('❌ Błąd skryptu:', error.message);
    }
}

createAdminUser();
