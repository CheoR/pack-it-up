import React from 'react';

export const Delete = ({ id, action }) => <button type="button" id={id} onClick={action}>Delete Button</button>;
// {

//   <Delete id={`btn--delete-${item.id}`} action={handleDelete}/>

//   const clickedBtn = (event) => {
//     event.preventDefault();
//     console.log('Delete button clicked');

//     console.log(' id ');
//     console.log(id);
//     console.log('action');
//     console.log(action);
//   };

//   return (
//     <button type="button" id={id} onClick={action}>Delete Button</button>
//   );
// };
