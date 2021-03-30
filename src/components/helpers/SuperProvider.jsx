import React, { useContext, useEffect, useState } from "react"
import { userStorageKey, userStorageUserName } from "../auth/authSettings"

import { BoxContext } from "../boxes/BoxProvider"
import { ItemContext } from "../items/ItemProvider"
import { MoveContext } from "../moves/MoveProvider"

console.log(" 0 before export const super provider")
export const SuperProvider = (props) => {
  /*
   SuperProvider does one big fetch and provides all the data for given user's moves.
  */

  console.log("1. In SuperProvider before imports")
  const { moves, getMoves } = useContext(MoveContext)
  const { boxes, getBoxes } = useContext(BoxContext)
  const { items, getItems } = useContext(ItemContext)
  const [isLoaded, setIsLoaded] = useState(false)
  const [usersData, setUsersData] = useState({})

  const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey))
  const loggedInUserName = sessionStorage.getItem(userStorageUserName)

  console.log("2. In Super Provider before use effect")

  useEffect(() => {
    console.log("use effect before calling anythnig")
    getMoves().then(() => console.log("get moves complete"))
      .then(getBoxes).then(() => console.log("get boxes complete"))
      .then(getItems).then(() => console.log("get items complete"))
      .then(() => setIsLoaded(true))
      .then(() => console.log("everything should be loaded now"))
    console.log("use effect after callign anything\n\n")
  }, []) // useEffect

  useEffect(() => {
    console.log("in the second use effect")
    console.log(`isLoaded: ${isLoaded}\n`)

    if (isLoaded) {
      const userMoves = moves.filter(m => m.userId === loggedInUserId)
      const userBoxes = boxes.filter(b => b.userId === loggedInUserId)
      const userItems = items.filter(i => i.userId === loggedInUserId)

      const userData = {
        items: {
          all: userItems
        },
        boxes: {
          all: userBoxes
        },
        moves: {
          all: userMoves
        }
      }

    }

  }, [isLoaded])


  console.log("3. In Super Provider after use effect")

  const superProvider = "SuperProvider"

  if (!isLoaded) return null

  return (<>
    {
      isLoaded
        ? <>Loaded </>
        : <>Loading </>
    }
    <div>{superProvider}</div>
    {
      moves.map((m, i) => <div key={i}>{m.id} {m.userId} </div>)
    }
  </>)


} // SuperProvider

console.log(" 4. after super provider")