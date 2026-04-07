type Props = {
  title: string;
  subtitle?: string;
};

export default function FullScreenState({ title, subtitle }: Props) {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
      <div className="text-center space-y-6">
        {/* Animated Ring */}
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute w-24 h-24 border border-blue-500/20 rounded-full animate-ping"></div>
        </div>

        {/* Message */}
        <div>
          <h1 className="text-xl font-semibold tracking-wide">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-300 mt-2">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}