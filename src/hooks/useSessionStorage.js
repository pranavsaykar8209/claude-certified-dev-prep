import { useState, useEffect } from 'react'

export default function useSessionStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = typeof window !== 'undefined' ? window.sessionStorage?.getItem(key) : null
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('Error reading from sessionStorage:', error)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        if (valueToStore === null) {
          window.sessionStorage?.removeItem(key)
        } else {
          window.sessionStorage?.setItem(key, JSON.stringify(valueToStore))
        }
      }
    } catch (error) {
      console.error('Error writing to sessionStorage:', error)
    }
  }

  return [storedValue, setValue]
}
