import * as React from "react"
import { isCoarsePointer } from "../../utils/device"

const GRID_SIZE = 16
const CELL = 14
const TICK_MS = 120

type Point = { x: number; y: number }
type Direction = "up" | "down" | "left" | "right"

const START_SNAKE: Point[] = [
  { x: 8, y: 8 },
  { x: 7, y: 8 },
  { x: 6, y: 8 },
]

function randomFood(snake: Point[]): Point {
  let spot: Point
  do {
    spot = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    }
  } while (snake.some(segment => segment.x === spot.x && segment.y === spot.y))
  return spot
}

function nextHead(head: Point, direction: Direction): Point {
  switch (direction) {
    case "up":
      return { x: head.x, y: head.y - 1 }
    case "down":
      return { x: head.x, y: head.y + 1 }
    case "left":
      return { x: head.x - 1, y: head.y }
    case "right":
      return { x: head.x + 1, y: head.y }
  }
}

function hitsWall(point: Point): boolean {
  return point.x < 0 || point.y < 0 || point.x >= GRID_SIZE || point.y >= GRID_SIZE
}

export const Snake: React.FC = () => {
  const [snake, setSnake] = React.useState<Point[]>(START_SNAKE)
  const [direction, setDirection] = React.useState<Direction>("right")
  const [pendingDirection, setPendingDirection] = React.useState<Direction>("right")
  const [food, setFood] = React.useState<Point>(() => randomFood(START_SNAKE))
  const [score, setScore] = React.useState(0)
  const [highScore, setHighScore] = React.useState(0)
  const [running, setRunning] = React.useState(false)
  const [gameOver, setGameOver] = React.useState(false)

  const resetGame = React.useCallback(() => {
    setSnake(START_SNAKE)
    setDirection("right")
    setPendingDirection("right")
    setFood(randomFood(START_SNAKE))
    setScore(0)
    setGameOver(false)
    setRunning(true)
  }, [])

  const turn = React.useCallback((next: Direction) => {
    setPendingDirection(current => {
      const opposite =
        (current === "up" && next === "down") ||
        (current === "down" && next === "up") ||
        (current === "left" && next === "right") ||
        (current === "right" && next === "left")
      return opposite ? current : next
    })
  }, [])

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      if (key === " " || key === "enter") {
        event.preventDefault()
        if (!running || gameOver) resetGame()
        return
      }
      if (!running || gameOver) return

      const turns: Record<string, Direction> = {
        arrowup: "up",
        w: "up",
        arrowdown: "down",
        s: "down",
        arrowleft: "left",
        a: "left",
        arrowright: "right",
        d: "right",
      }
      const next = turns[key]
      if (!next) return
      event.preventDefault()
      turn(next)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [running, gameOver, resetGame, turn])

  // Touch controls: tap to start/retry, swipe to steer.
  const touchStart = React.useRef<{ x: number; y: number } | null>(null)

  const onBoardTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }

  const onBoardTouchEnd = (event: React.TouchEvent) => {
    const start = touchStart.current
    touchStart.current = null
    if (!start) return
    const touch = event.changedTouches[0]
    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y
    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) {
      if (!running || gameOver) resetGame()
      return
    }
    if (!running || gameOver) return
    turn(
      Math.abs(dx) > Math.abs(dy)
        ? dx > 0
          ? "right"
          : "left"
        : dy > 0
        ? "down"
        : "up"
    )
  }

  React.useEffect(() => {
    if (!running || gameOver) return

    const interval = setInterval(() => {
      setDirection(pendingDirection)
      setSnake(previous => {
        const head = nextHead(previous[0], pendingDirection)
        if (hitsWall(head) || previous.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true)
          setRunning(false)
          setHighScore(best => Math.max(best, score))
          return previous
        }

        const ateFood = head.x === food.x && head.y === food.y
        const nextSnake = [head, ...previous]
        if (!ateFood) {
          nextSnake.pop()
        } else {
          setScore(value => value + 10)
          setFood(randomFood(nextSnake))
        }
        return nextSnake
      })
    }, TICK_MS)

    return () => clearInterval(interval)
  }, [running, gameOver, pendingDirection, food, score])

  return (
    <div
      className="flex flex-col items-center justify-center h-full gap-3 p-4 select-none"
      style={{ background: "#0a0a0a", fontFamily: '"Courier New", monospace' }}
    >
      <div className="flex gap-8 text-sm" style={{ color: "#33ff33" }}>
        <span>SCORE: {score.toString().padStart(4, "0")}</span>
        <span>HI: {highScore.toString().padStart(4, "0")}</span>
      </div>

      <div
        className="relative border-2"
        onTouchStart={onBoardTouchStart}
        onTouchEnd={onBoardTouchEnd}
        style={{
          width: GRID_SIZE * CELL,
          height: GRID_SIZE * CELL,
          touchAction: "none",
          borderColor: "#33ff33",
          boxShadow: "0 0 20px rgba(51,255,51,0.25), inset 0 0 30px rgba(51,255,51,0.05)",
          background: "#001100",
        }}
      >
        {snake.map((segment, index) => (
          <div
            key={`${segment.x}-${segment.y}-${index}`}
            style={{
              position: "absolute",
              left: segment.x * CELL,
              top: segment.y * CELL,
              width: CELL - 1,
              height: CELL - 1,
              background: index === 0 ? "#66ff66" : "#33ff33",
              boxShadow: index === 0 ? "0 0 6px #33ff33" : undefined,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: food.x * CELL,
            top: food.y * CELL,
            width: CELL - 1,
            height: CELL - 1,
            background: "#ff3333",
            borderRadius: "50%",
            boxShadow: "0 0 8px #ff3333",
          }}
        />
        {!running && !gameOver && (
          <div
            className="absolute inset-0 flex items-center justify-center text-center text-xs px-2"
            style={{ background: "rgba(0,0,0,0.75)", color: "#33ff33" }}
          >
            {isCoarsePointer() ? (
              <>
                TAP TO START
                <br />
                SWIPE TO MOVE
              </>
            ) : (
              <>
                PRESS SPACE TO START
                <br />
                ARROWS / WASD TO MOVE
              </>
            )}
          </div>
        )}
        {gameOver && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center text-xs gap-2"
            style={{ background: "rgba(0,0,0,0.85)", color: "#ff3333" }}
          >
            <span>GAME OVER</span>
            <span style={{ color: "#33ff33" }}>
              {isCoarsePointer() ? "TAP TO RETRY" : "SPACE TO RETRY"}
            </span>
          </div>
        )}
      </div>

      <p className="text-xs text-center max-w-xs" style={{ color: "#228822" }}>
        Snake v1.0 — because every engineer learned loops on a grid
      </p>
    </div>
  )
}
