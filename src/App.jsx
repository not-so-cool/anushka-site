import anushkaData from './data/anushkaData'
import useSmoothScroll from './animations/useSmoothScroll'
import GrainOverlay from './components/GrainOverlay'
import CustomCursor from './components/CustomCursor'
import Opening from './sections/Opening'
import Years from './sections/Years'
import MemoryWall from './sections/MemoryWall'
import Remember from './sections/Remember'
import Letter from './sections/Letter'
import Journey from './sections/Journey'
import Chapter from './sections/Chapter'
import Ending from './sections/Ending'

export default function App() {
  useSmoothScroll()

  return (
    <>
      <GrainOverlay />
      <CustomCursor label={anushkaData.cursor.label} />

      <main>
        <Opening data={anushkaData.opening} />
        <Years data={anushkaData.years} />
        <MemoryWall data={anushkaData.memoryWall} />
        <Remember data={anushkaData.remember} />
        <Letter data={anushkaData.letter} />
        <Journey data={anushkaData.journey} />
        <Chapter data={anushkaData.chapter} />
        <Ending data={anushkaData.ending} />
      </main>
    </>
  )
}
