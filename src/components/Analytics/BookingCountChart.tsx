"use client"

import { TrendingUp, TrendingDown, Loader2 } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "hsl(25, 95%, 53%)",
  },
} satisfies ChartConfig

interface BookingCountChartProps {
  data: {
    month: string
    bookings: number
  }[]
  growthPercentage: string
  isLoading: boolean
  currentYear: number
}

const BookingCountChart: React.FC<BookingCountChartProps> = ({
  data,
  growthPercentage,
  isLoading,
  currentYear,
}) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Booking Count Chart</CardTitle>
          <CardDescription>Loading data...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Booking Count Chart</CardTitle>
        <CardDescription>Monthly booking counts {currentYear}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="bookings"
              fill="var(--color-bookings)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className="flex gap-2 font-medium leading-none">
          {parseFloat(growthPercentage) >= 0 ? (
            <>
              Trending up by {growthPercentage}% this month{" "}
              <TrendingUp className="h-4 w-4 text-green-500" />
            </>
          ) : (
            <>
              Trending down by {Math.abs(parseFloat(growthPercentage))}% this
              month <TrendingDown className="h-4 w-4 text-red-500" />
            </>
          )}
        </div> */}
        <div className="leading-none text-muted-foreground">
          Showing total bookings for each month in {currentYear}
        </div>
      </CardFooter>
    </Card>
  )
}

export default BookingCountChart
