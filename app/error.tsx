"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-[#131b2e] rounded-xl p-8 max-w-md text-center">
        <h2 className="serif-display text-2xl font-bold text-[#dae2fd] mb-4">
          Error
        </h2>
        <p className="text-[#c6c6cd] mb-6">
          {error.message || "Algo salio mal"}
        </p>
        <button
          onClick={reset}
          className="bg-[#e9c176] text-[#412d00] px-6 py-2 rounded-lg font-semibold"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
