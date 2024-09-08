import "./globals.css";
export default function NotFoundPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-10">
        <h1 className="text-3xl"> 404 - Page not found</h1>
        <a href="/">
          <button className="btn">Back to home</button>
        </a>
      </div>
    </div>
  );
}
