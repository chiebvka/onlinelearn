import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function Home() {
  return (
    <div>
      <p className='text-4xl font-medium text-sky-700'>Hello world!</p>
      <Button variant="alpha">Click Me</Button>
    </div>
  )
}
