import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const privyAppSecret = process.env.PRIVY_APP_SECRET;

  if (!privyAppId || !privyAppSecret) {
    return NextResponse.json({ error: 'Missing Privy credentials' }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get('cursor');

  const url = cursor
    ? `https://auth.privy.io/api/v1/users?cursor=${cursor}`
    : 'https://auth.privy.io/api/v1/users';

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${privyAppId}:${privyAppSecret}`).toString('base64')}`,
        'privy-app-id': privyAppId,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Privy API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const privyAppSecret = process.env.PRIVY_APP_SECRET;

  if (!privyAppId || !privyAppSecret) {
    return NextResponse.json({ error: 'Missing Privy credentials' }, { status: 500 });
  }

  try {
    const { address } = await req.json();

    const response = await fetch(`https://auth.privy.io/api/v1/users/wallet/address`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${privyAppId}:${privyAppSecret}`).toString('base64')}`,
        'privy-app-id': privyAppId,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ address })
    });

    if (!response.ok) {
      throw new Error(`Privy API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching user by wallet address:', error);
    return NextResponse.json({ error: 'Failed to fetch user by wallet address' }, { status: 500 });
  }
} 