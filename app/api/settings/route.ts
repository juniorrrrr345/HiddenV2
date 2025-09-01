import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Settings from '@/models/Settings';

export async function GET() {
  try {
    await dbConnect();
    let settings = await Settings.findOne({});
    
    if (!settings) {
      settings = await Settings.create({
        shopName: 'HIDDEN SPINGFIELD',
        bannerText: 'NOUVEAU DROP',
        bannerImage: '',
        backgroundType: 'color',
        backgroundColor: 'black',
        backgroundImage: '',
        gradientFrom: '#000000',
        gradientTo: '#111111',
        orderLink: '',
        burnsLink: '',
        apuLink: '',
        moeLink: ''
      });
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    let settings = await Settings.findOne({});
    
    if (!settings) {
      settings = await Settings.create(body);
    } else {
      settings = await Settings.findOneAndUpdate(
        {},
        body,
        { new: true, runValidators: true }
      );
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}