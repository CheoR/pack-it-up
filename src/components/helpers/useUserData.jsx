import { useContext, useEffect, useState } from "react"

import { userStorageKey, userStorageUserName } from "../auth/authSettings"
import { getSum2 } from "./helpers"

import { BoxContext } from "../boxes/BoxProvider"
import { ItemContext } from "../items/ItemProvider"
import { MoveContext } from "../moves/MoveProvider"

let renderCount = 1

export const useUserData = ( loggedInUserId ) => {
  
  const { moves, setMoves, getMovesByUserId, addMove } = useContext(MoveContext)
  const { boxes, setBoxes, getBoxesByUserId, addBox  } = useContext(BoxContext)
  const { items, setItems, getItemsByUserId, addItem } = useContext(ItemContext)
  
  const [ pendingData, setPendingData ] = useState(false)
  const [ error, setError ] = useState(null)

  console.log(`useUserdata - pendingData: ${pendingData} - renderCount: ${renderCount}`)
  const [ data, setData ] = useState({
    type: {
      move: moves || [],
      box:  boxes || [],
      item: items || []
    },
    add: {
      move: addMove,
      box: addBox,
      item: addItem
    }
  })
 useEffect(() => {
  console.log(`useUserdata - useEffect: renderCount: ${renderCount}`)
  setPendingData(true)

  const _fetchData = async () => {
      const _moves = getMovesByUserId()
      const _boxes = getBoxesByUserId()
      const _items = getItemsByUserId()
      
      return await Promise.all([_moves, _boxes, _items])
    } // _fetchData


  const _aggregateMoveInfo = ( values ) => {
    let _moves = values[0]
    let _boxes = values[1]
    let _items = values[2]

    _moves.forEach(move => {
        /*
        Aggregate box/item information per move.
        */
        const boxesForThisMove = _boxes.filter(box => box.moveId === move.id)
      
        move.totalBoxCount = boxesForThisMove.length
        move.totalItemsCount = 0
        move.totalItemsValue = 0

        boxesForThisMove.forEach(box => {
            const itemsInBox = _items.filter(item => item.boxId === box.id)
        
            move.totalItemsCount += itemsInBox.length
            move.totalItemsValue += getSum2(itemsInBox.filter(item => item.value ? item.value : 0))
            box.isFragile = itemsInBox.some(item => item.isFragile ? true : false)
        }) // boxesForThisMove.forEach

      /*
        Mark move fragile if any of its boxes are marked fragile.
        Boxes are marked fragile if any of its items are marked fragile.
      */
      move.isFragile = boxesForThisMove.some(b => b.isFragile)
    }) // _moves

    return { _moves, _boxes, _items }
  } // _aggregateMoveInfo


  const _setData = ({ _moves, _boxes, _items }) => {
    setData({
      type: {
        move: _moves,
        box:  _boxes,
        item: _items
      },
      add: {
        move: addMove,
        box: addBox,
        item: addItem
      }
    }) // setData
  } //_setData


    _fetchData()
      .then(values => _aggregateMoveInfo)
      .then(values => _setData)
      .catch((error) => {
        setError(error)
      })
      .finally(() => setPendingData(false))

    }, []) // useEffect


  renderCount += 1
 return [ data , pendingData, setPendingData, error ]

} // useUserData



