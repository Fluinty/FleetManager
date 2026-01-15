// Script to create KTW user
const SUPABASE_URL = 'https://bsqibeirdfjdphpyqnlx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Cj9NP8WIAzw0f0l-r-jLLQ_xU-6IIvN';

async function createUser() {
    try {
        // Try to sign up the user
        const signupResponse = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'ktw@art-tim.pl',
                password: 'admin123',
            }),
        });

        const result = await signupResponse.json();

        if (signupResponse.ok) {
            console.log('✅ Użytkownik utworzony!');
            console.log('User ID:', result.user?.id);
            console.log('Email:', result.user?.email);

            if (result.user?.id) {
                // Now add the profile
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
                        role: 'manager',
                        branch_id: '07168534-44eb-45e6-9818-9a4be9fe926c', // KTW branch
                    }),
                });

                if (profileResponse.ok) {
                    console.log('✅ Profil dodany dla oddziału Katowice (KTW)');
                } else {
                    const profileError = await profileResponse.json();
                    console.log('⚠️ Błąd dodawania profilu:', profileError);
                    console.log('Profil należy dodać ręcznie w panelu Supabase');
                }
            }
        } else {
            console.log('❌ Błąd:', result.error_description || result.msg || JSON.stringify(result));
        }
    } catch (error) {
        console.error('❌ Błąd:', error.message);
    }
}

createUser();
