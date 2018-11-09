import { useEffect } from 'react'

export default function OnMount ({ onEffect }) {
  useEffect(onEffect, [])
  return null
}
