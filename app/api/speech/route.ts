import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI();

export async function POST(request: NextRequest) {
  try {
    const { text, character, voice } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "テキストが提供されていません" },
        { status: 400 }
      );
    }

    const response = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: voice || "coral",
      input: text,
      instructions: character,
    });

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("音声生成エラー:", error);
    return NextResponse.json(
      { error: "音声生成に失敗しました" },
      { status: 500 }
    );
  }
}
