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

  const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey))
  const loggedInUserName = sessionStorage.getItem(userStorageUserName)

  const { moves, getMovesByUserId } = useContext(MoveContext)
  const { boxes, getBoxesByUserId } = useContext(BoxContext)
  const { items, getItemsByUserId } = useContext(ItemContext)

  const [ isLoading, setIsLoading ] = useState(true)
  const [ userData, setUserData ] = useState({})


  console.log("2. In Super Provider before use effect")

  useEffect(() => {
    console.log("use effect before calling anythnig")
    getMovesByUserId().then(() => console.log("get moves complete"))
      .then(getBoxesByUserId).then(() => console.log("get boxes complete"))
      .then(getItemsByUserId).then(() => console.log("get items complete"))
      .then(() => setIsLoading(false))
      .then(() => console.log("everything should be loaded now"))
      .then(() => {

        const userData = {
          items: {
            all: items
          },
          boxes: {
            all: boxes
          },
          moves: {
            all: moves
          }
        }
      })
      setUserData(userData)
    console.log("use effect after callign anything\n\n")
  }, []) // useEffect

  // useEffect(() => {
  //   console.log("in the second use effect")
  //   console.log(`IsLoading: ${IsLoading}\n`)

  //   if (!isLoading) {
  //     const userMoves = moves.filter(m => m.userId === loggedInUserId)
  //     const userBoxes = boxes.filter(b => b.userId === loggedInUserId)
  //     const userItems = items.filter(i => i.userId === loggedInUserId)


  //   }

  // }, [ isLoading ])


  console.log("3. In Super Provider after use effect")

  const superProvider = "SuperProvider"

  if (isLoading) return null

  return (<>
    {
      !isLoading
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