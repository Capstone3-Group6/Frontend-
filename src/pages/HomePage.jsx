import { Link } from 'react-router';

export default function HomePage() {
  return (
    <section className='text-center'>
      <h1 className='text-7xl'>Capstone Starter</h1>
      <p className='mb-6'>
        A <code>React</code> + <code>Vite</code> frontend wired to the{' '}
        <code>Express</code> /<code>Postgres</code> backend
      </p>
      <p className='mb-6'>
        The Tasks page pulls live data from <code>/api/tasks</code>.
      </p>
      <Link
        to='/tasks'
        className='inline-block rounded-md bg-(--accent) px-5 py-2.5 font-medium text-white hover:bg-(--accent-border)'
      >
        View tasks →
      </Link>
    </section>
  );
}
