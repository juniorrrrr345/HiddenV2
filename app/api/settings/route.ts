import { NextRequest, NextResponse } from 'next/server';
import { executeSqlOnD1 } from '@/lib/cloudflare-d1';

export async function GET() {
  try {
    const result = await executeSqlOnD1('SELECT * FROM settings WHERE id = 1');
    let settings = result.result?.[0]?.results?.[0];
    
    if (!settings) {
      // Créer les settings par défaut
      await executeSqlOnD1(
        'INSERT INTO settings (id, shop_title, theme_color, background_opacity, background_blur) VALUES (?, ?, ?, ?, ?)',
        [1, 'HIDDEN SPINGFIELD', 'glow', 20, 5]
      );
      
      const newResult = await executeSqlOnD1('SELECT * FROM settings WHERE id = 1');
      settings = newResult.result?.[0]?.results?.[0];
    }
    
    return NextResponse.json(settings || {});
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Construire la requête UPDATE dynamiquement
    const fields = [];
    const values = [];
    
    if (body.shop_title !== undefined) { fields.push('shop_title = ?'); values.push(body.shop_title); }
    if (body.background_image !== undefined) { fields.push('background_image = ?'); values.push(body.background_image); }
    if (body.banner_image !== undefined) { fields.push('banner_image = ?'); values.push(body.banner_image); }
    if (body.banner_text !== undefined) { fields.push('banner_text = ?'); values.push(body.banner_text); }
    if (body.background_opacity !== undefined) { fields.push('background_opacity = ?'); values.push(body.background_opacity); }
    if (body.background_blur !== undefined) { fields.push('background_blur = ?'); values.push(body.background_blur); }
    if (body.info_content !== undefined) { fields.push('info_content = ?'); values.push(body.info_content); }
    if (body.contact_content !== undefined) { fields.push('contact_content = ?'); values.push(body.contact_content); }
    if (body.whatsapp_link !== undefined) { fields.push('whatsapp_link = ?'); values.push(body.whatsapp_link); }
    if (body.whatsapp_number !== undefined) { fields.push('whatsapp_number = ?'); values.push(body.whatsapp_number); }
    if (body.scrolling_text !== undefined) { fields.push('scrolling_text = ?'); values.push(body.scrolling_text); }
    if (body.theme_color !== undefined) { fields.push('theme_color = ?'); values.push(body.theme_color); }
    if (body.burns_link !== undefined) { fields.push('burns_link = ?'); values.push(body.burns_link); }
    if (body.apu_link !== undefined) { fields.push('apu_link = ?'); values.push(body.apu_link); }
    if (body.moe_link !== undefined) { fields.push('moe_link = ?'); values.push(body.moe_link); }
    if (body.bannerImage !== undefined) { fields.push('banner_image = ?'); values.push(body.bannerImage); }
    if (body.backgroundImage !== undefined) { fields.push('background_image = ?'); values.push(body.backgroundImage); }
    
    if (fields.length > 0) {
      values.push(1); // WHERE id = 1
      
      await executeSqlOnD1(
        `UPDATE settings SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
    }
    
    // Récupérer les settings mis à jour
    const result = await executeSqlOnD1('SELECT * FROM settings WHERE id = 1');
    const settings = result.result?.[0]?.results?.[0];
    
    return NextResponse.json(settings || {});
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}