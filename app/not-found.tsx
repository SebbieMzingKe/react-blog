import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found">
      <h2>Sorry</h2>
      <p>That page cannot be found</p>
      <Link href="/">Back to the Homepage...</Link>
    </div>
  );
}