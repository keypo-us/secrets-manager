import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const privyAppSecret = process.env.PRIVY_APP_SECRET;

  if (!privyAppId || !privyAppSecret) {
    return NextResponse.json({ error: 'Missing Privy credentials' }, { status: 500 });
  }

  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Missing email address' }, { status: 400 });
    }

    // Always attempt to create user and pregenerate wallet
    const createRes = await fetch('https://auth.privy.io/api/v1/users', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${privyAppId}:${privyAppSecret}`).toString('base64')}`,
        'privy-app-id': privyAppId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        linked_accounts: [
          { address: email, type: 'email' }
        ],
        wallets: [
          { chain_type: 'ethereum' }
        ]
      })
    });
    if (!createRes.ok) {
      const errorBody = await createRes.text();
      console.error('Privy API error response:', createRes.status, errorBody);
      throw new Error(`Privy API error: ${createRes.statusText} - ${errorBody}`);
    }
    const createData = await createRes.json();
    return NextResponse.json({ user: createData, walletCreated: true });
  } catch (error) {
    console.error('Error pregenerating wallet:', error);
    return NextResponse.json({ error: 'Failed to pregenerate wallet' }, { status: 500 });
  }
} 