"use client";
import React, { useState } from "react";
import voices from "@/app/data/voices";
import presetCharacters from "@/app/data/characters";

export default function Home() {
  const [text, setText] = useState("");
  const [character, setCharacter] = useState(presetCharacters[0].value);
  const [voice, setVoice] = useState("coral");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, character, voice }),
      });

      if (!res.ok) throw new Error("音声生成に失敗しました");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      const audio = new Audio(url);
      audio.play();
    } catch (err) {
      console.error(err);
    }

    setText("");
    // キャラクター設定は保持する
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-24">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4"
      >
        <h1 className="text-2xl font-bold">音声生成</h1>
        <input
          type="text"
          onChange={(e) => setText(e.target.value)}
          value={text}
          className="border border-gray-300 focus:outline-none p-2 rounded-md w-96"
          placeholder="テキストを入力"
        />
        {/* 音声選択 */}
        <div className="w-full max-w-2xl mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            音声を選択
          </label>
          <div className="flex flex-wrap justify-center gap-2">
            {voices.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVoice(v.id)}
                className={`px-3 py-1 rounded-md text-sm ${
                  voice === v.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>

        {/* キャラクター選択ボタン */}
        <div className="flex flex-wrap justify-center gap-2 mb-4 w-full max-w-2xl">
          {presetCharacters.map((preset, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCharacter(preset.value)}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md text-sm"
            >
              {preset.name}
            </button>
          ))}
        </div>

        <textarea
          onChange={(e) => setCharacter(e.target.value)}
          value={character}
          className="border border-gray-300 focus:outline-none p-2 rounded-md w-96 h-32"
          placeholder="キャラクター設定"
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
          type="submit"
        >
          音声を生成
        </button>
      </form>

      {audioUrl && (
        <div className="mt-6 flex flex-col items-center gap-4">
          <audio controls src={audioUrl} />
          <a
            href={audioUrl}
            download="speech.mp3"
            className="text-white bg-green-500 hover:bg-green-600 py-2 px-4 rounded-md"
          >
            音声をダウンロード
          </a>
        </div>
      )}
    </div>
  );
}
