import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const type = formData.get('type'); // 'ela' or 'compare'
    const file1 = formData.get('image1') as File;
    const file2 = formData.get('image2') as File;

    const buffer1 = Buffer.from(await file1.arrayBuffer());
    let resultBuffer: Buffer;

    if (type === 'ela') {
      const compressed = await sharp(buffer1).jpeg({ quality: 90 }).toBuffer();
      resultBuffer = await sharp(buffer1).composite([{ input: compressed, blend: 'difference' }]).toBuffer();
    } else {
      const buffer2 = Buffer.from(await file2.arrayBuffer());
      const meta1 = await sharp(buffer1).metadata();
      const resized2 = await sharp(buffer2).resize(meta1.width, meta1.height).toBuffer();
      resultBuffer = await sharp(buffer1).composite([{ input: resized2, blend: 'difference' }]).toBuffer();
    }

    const finalImage = await sharp(resultBuffer).normalize().modulate({ brightness: 10 }).png().toBuffer();
    return new NextResponse(new Uint8Array(finalImage), { headers: { 'Content-Type': 'image/png' } });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}