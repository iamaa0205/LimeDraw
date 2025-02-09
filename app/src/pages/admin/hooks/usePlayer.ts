"use client"

import { useState, useCallback } from "react"
import { LogicApiDataSource } from "../api/dataSource/LogicApiDataSource"

export const usePlayer = () => {
  const [player, setPlayer] = useState(null)

  const createPlayer = useCallback(async (name: string) => {
    try {
      const response = await new LogicApiDataSource().createPlayer({ name })
      if (response?.data) {
        setPlayer(response.data)
      }
    } catch (error) {
      console.error("Failed to create player:", error)
    }
  }, [])

  return { player, createPlayer }
}

