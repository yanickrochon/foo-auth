# Foo Auth React Adapter

```tsx
import * as React from 'react';
import { SessionProvider } from '@foo-auth/react';

import type { SessionType } from './types';


type LayoutProps = {
  session:SessionType;
  children: React.ReactNode;
};

const LayoutComponent = ({ session, children }:LayoutProps) => {
  return (
    <SessionProvider session={ session }>
      { children }
    </SessionProvider>
  );
};

export default LayoutComponent;
```

```tsx
import * as React from 'react';

import type { SessionType } from './types';

const PageComponent = () => {
  const session = useSession<SessionType>();

  return (
    <div>{ JSON.stringify(session) }</div>
  );
};

export default PageComponent;
```

```tsx
import * as React from 'react';

import LayoutComponent from './LayoutComponent';
import PageComponent from './PageComponent';

import type { SessionType } from './types';


const App = () => {
  const session:SessionType = {};

  return (
    <LayoutComponent session={ session }>
      <PageComponent />
    </LayoutComponent>
  );
};

export default App;
```