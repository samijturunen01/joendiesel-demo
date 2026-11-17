import { Route, Routes } from 'react-router';
import { Layout } from '@/components/layout/Layout';
import { pages } from '@/data/site';
import { CommonRail } from '@/pages/CommonRail';
import { Company } from '@/pages/Company';
import { Contact } from '@/pages/Contact';
import { Diagnostics } from '@/pages/Diagnostics';
import { Financing } from '@/pages/Financing';
import { Home } from '@/pages/Home';
import { Injection } from '@/pages/Injection';
import { NotFound } from '@/pages/NotFound';
import { Parts } from '@/pages/Parts';
import { Services } from '@/pages/Services';

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path={pages.home.path} element={<Home />} />
        <Route path={pages.services.path} element={<Services />} />
        <Route path={pages.diagnostics.path} element={<Diagnostics />} />
        <Route path={pages.injection.path} element={<Injection />} />
        <Route path={pages.commonRail.path} element={<CommonRail />} />
        <Route path={pages.parts.path} element={<Parts />} />
        <Route path={pages.company.path} element={<Company />} />
        <Route path={pages.financing.path} element={<Financing />} />
        <Route path={pages.contact.path} element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
