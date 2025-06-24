import { ResultList } from '@/components/common/result-list';
import AppLayout from '@/components/layouts/app-layout';
import Hero from '@/components/sections/hero/default';

export default function Home() {
  return (
    <>
      <AppLayout>
        <ResultList />
        <Hero />
      </AppLayout>
    </>
  );
}
