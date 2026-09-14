import { Routes, Route } from 'react-router-dom';

import Layout from '@client/src/components/Layout';
import GroupsPage from '@client/src/pages/GroupsPage/GroupsPage';
import NewGroupPage from '@client/src/pages/GroupsPage/NewGroupPage';
import GroupExpensesPage from '@client/src/pages/GroupPage/GroupExpensesPage';
import ExpenseFormPage from '@client/src/pages/GroupPage/ExpenseFormPage';
import SettlementPage from '@client/src/pages/GroupPage/SettlementPage';
import MembersPage from '@client/src/pages/GroupPage/MembersPage';
import NotFound from '@client/src/pages/NotFound/NotFound';

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<GroupsPage />} />
        <Route path="/groups/new" element={<NewGroupPage />} />
        <Route path="/groups/:groupId" element={<GroupExpensesPage />} />
        <Route path="/groups/:groupId/expenses/new" element={<ExpenseFormPage mode="create" />} />
        <Route path="/groups/:groupId/expenses/:expenseId/edit" element={<ExpenseFormPage mode="edit" />} />
        <Route path="/groups/:groupId/settlement" element={<SettlementPage />} />
        <Route path="/groups/:groupId/members" element={<MembersPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
