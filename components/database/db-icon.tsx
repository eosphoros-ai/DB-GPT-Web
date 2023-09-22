import Image from 'next/image';

function DBIcon({ src, label }: { src: string; label: string }) {
  return (
    <Image
      className="w-11 h-11 rounded-full mr-4 border border-gray-200 object-contain bg-white"
      width={44}
      height={44}
      src={src}
      alt={label || 'db-icon'}
    />
  );
}

export default DBIcon;
