import { ResultList } from '@/components/common/result-list';
import AppLayout from '@/components/layouts/app-layout';
import Header from '@/components/layouts/header';

export default function Home() {
  return (
    <>
      <Header />
      <AppLayout>
        <ResultList />
      </AppLayout>
    </>
  );
}
