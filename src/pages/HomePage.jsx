import { Link } from 'react-router';

export default function HomePage() {
  return (
    <section className='text-center'>
      <h1>Capstone Starter</h1>
      <p className='mb-6'>
        A React + Vite frontend wired to the Express / Postgres backend. The
        Tasks page pulls live data from <code>/api/tasks</code>.
      </p>
      <Link
        to='/tasks'
        className='inline-block rounded-md bg-(--accent) px-5 py-2.5 font-medium text-white'
      >
        View tasks →
      </Link>
    </section>
  );
}
