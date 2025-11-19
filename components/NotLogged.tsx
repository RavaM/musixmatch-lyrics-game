import Link from "next/link";

export default function NotLogged() {
  return (
    <p>
      You are not logged in. Go back to the{" "}
      <Link href="/" className="underline pointer-events-auto">
        home page
      </Link>{" "}
      and enter a username.
    </p>
  );
}
