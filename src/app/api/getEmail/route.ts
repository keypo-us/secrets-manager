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

    const response = await fetch('https://auth.privy.io/api/v1/users/email/address', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${privyAppId}:${privyAppSecret}`).toString('base64')}`,
        'privy-app-id': privyAppId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address: email })
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ walletAddress: '' });
      }
      throw new Error(`Privy API error: ${response.statusText}`);
    }

    const user = await response.json();
    const ethWallet = user.linked_accounts?.find(
      (acc: { type: string; chain_type: string; address?: string }) => acc.type === 'wallet' && acc.chain_type === 'ethereum'
    );
    return NextResponse.json({ walletAddress: ethWallet ? ethWallet.address : '' });
  } catch (error) {
    console.error('Error checking email for wallet:', error);
    return NextResponse.json({ error: 'Failed to check email for wallet' }, { status: 500 });
  }
} 