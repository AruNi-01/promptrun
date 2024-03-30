export default function ImgGallery() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <div className="grid gap-4 h-full">
        <div>
          <img className="h-auto max-w-full rounded-lg" src="/gallery/1.png" alt="gallery-photo" />
        </div>
        <div>
          <img className="h-auto max-w-full rounded-lg" src="/gallery/2.png" alt="gallery-photo" />
        </div>
        <div>
          <img className="h-auto max-w-full rounded-lg" src="/gallery/3.png" alt="gallery-photo" />
        </div>
      </div>
      <div className="grid gap-4">
        <div>
          <img className="h-auto max-w-full rounded-lg" src="/gallery/4.png" alt="gallery-photo" />
        </div>
        <div>
          <img className="h-auto max-w-full rounded-lg" src="/gallery/5.png" alt="gallery-photo" />
        </div>
        <div>
          <img className="h-auto max-w-full rounded-lg " src="/gallery/6.png" alt="gallery-photo" />
        </div>
      </div>
      <div className="grid gap-4">
        <div>
          <img className="h-auto max-w-full rounded-lg" src="/gallery/7.png" alt="gallery-photo" />
        </div>
        <div>
          <img className="h-auto max-w-full rounded-lg " src="/gallery/8.png" alt="gallery-photo" />
        </div>
        <div>
          <img className="h-auto max-w-full rounded-lg" src="/gallery/9.png" alt="gallery-photo" />
        </div>
      </div>
      <div className="grid gap-4">
        <div>
          <img className="h-auto max-w-full rounded-lg" src="/gallery/10.png" alt="gallery-photo" />
        </div>
        <div>
          <img className="h-auto max-w-full rounded-lg" src="/gallery/11.png" alt="gallery-photo" />
        </div>
        <div>
          <img className="h-auto max-w-full rounded-lg" src="/gallery/12.png" alt="gallery-photo" />
        </div>
      </div>
    </div>
  );
}
