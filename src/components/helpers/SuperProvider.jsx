import React, { createContext, useContext, useEffect, useState } from 'react';

import { BoxContext } from '../boxes/BoxProvider';
import { ItemContext } from '../items/ItemProvider';
import { MoveContext } from '../moves/MoveProvider';

export const SuperDataContext = createContext();

export const SuperDataProvider = (props) => {
  const { moves, getMovesByUserId } = useContext(MoveContext);
  const { boxes, getBoxesByUserId } = useContext(BoxContext);
  const { items, getItemsByUserId } = useContext(ItemContext);

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(async () => {
    setIsLoading(true);
    getMovesByUserId()
      .then(() => console.log('get moves complete'))
      .then(getBoxesByUserId)
      .then(() => console.log('get boxes complete'))
      .then(getItemsByUserId)
      .then(() => console.log('get items complete'))
      .then(() => setIsLoading(false))
      .then(() => console.log('everything should be loaded now'))
      .then(() => {
        const userData = {
          items: {
            all: items,
          },
          boxes: {
            all: boxes,
          },
          moves: {
            all: moves,
          },
        };
        setData(userData);
        setIsLoading(false);
      });
    // await Promise.all([getMovesByUserId, getBoxesByUserId, getItemsByUserId])
    //   .then((values) {
    //     const userData = {
    //       items: {
    //         all: items,
    //       },
    //       boxes: {
    //         all: boxes,
    //       },
    //       moves: {
    //         all: moves,
    //       },
    //     };
    //     setData(userData);
    //     setIsLoading(false);
    //   });
  }, []);

  if (isLoading) return null;

  console.log('supe user provider data');
  console.table(data);

  return (
    <SuperDataContext.Provider value={{
      data,
    }}>
      { props.children }
    </SuperDataContext.Provider>
  );
};

// import React, { useContext, useEffect, useState } from 'react';
// // import { userStorageKey, userStorageUserName } from '../auth/authSettings';

// import { BoxContext } from '../boxes/BoxProvider';
// import { ItemContext } from '../items/ItemProvider';
// import { MoveContext } from '../moves/MoveProvider';

// console.log(' 0 before export const super provider');

// export const SuperProvider = () => {
//   /*
//   SuperProvider does one big fetch and provides all the data for given user's moves.
//   */

//   console.log('1. In SuperProvider before imports');

//   // const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey), 10);
//   // const loggedInUserName = sessionStorage.getItem(userStorageUserName);

//   const { moves, getMovesByUserId } = useContext(MoveContext);
//   const { boxes, getBoxesByUserId } = useContext(BoxContext);
//   const { items, getItemsByUserId } = useContext(ItemContext);

//   const [isLoading, setIsLoading] = useState(true);
//   const [useData, setUserData] = useState({});

//   console.log('2. In Super Provider before use effect');

//   useEffect(() => {
//     console.log('use effect before calling anythnig');
//     getMovesByUserId()
//       .then(() => console.log('get moves complete'))
//       .then(getBoxesByUserId)
//       .then(() => console.log('get boxes complete'))
//       .then(getItemsByUserId)
//       .then(() => console.log('get items complete'))
//       .then(() => setIsLoading(false))
//       .then(() => console.log('everything should be loaded now'))
//       .then(() => {
//         const userData = {
//           items: {
//             all: items,
//           },
//           boxes: {
//             all: boxes,
//           },
//           moves: {
//             all: moves,
//           },
//         };
//         setUserData(userData);
//       });
//     console.log('use effect after callign anything\n\n');
//   }, []); // useEffect

//   console.log('3. In Super Provider after use effect');

//   // const superProvider = 'SuperProvider';

//   if (isLoading) return null;

//   return (
//     <>
//       {
//         !isLoading
//           ? <>Loaded </>
//           : <>Loading </>
//       }
//       <div>{superProvider}</div>
//       {
//         moves.map((m) => <div key={m.id}>{m.id} {m.userId} </div>)
//       }
//     </>
//   );
// }; // SuperProvider

// console.log(' 4. after super provider');
