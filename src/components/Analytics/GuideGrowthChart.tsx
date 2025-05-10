"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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
  users: {
    label: "Guide",
    color: "hsl(217, 91%, 60%)",
  },
} satisfies ChartConfig

interface GuideGrowthChartProps {
  data: {
    month: string
    users: number
  }[]
  growthPercentage: string
  isLoading: boolean
  currentYear: number
}

const GuideGrowth: React.FC<GuideGrowthChartProps> = ({
  data,
  growthPercentage,
  isLoading,
  currentYear,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Growth Chart</CardTitle>
          <CardDescription>Loading data...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return data && data.length > 0 ? (
    <Card>
      <CardHeader>
        <CardTitle>Guide Growth Chart</CardTitle>
        <CardDescription>Guide registrations {currentYear}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={true} />
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
            <Line
              dataKey="users"
              type="natural"
              stroke="var(--color-users)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
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
          Showing monthly user registrations for {currentYear}
        </div>
      </CardFooter>
    </Card>
  ) : (
    <Card>
      <CardHeader>
        <CardTitle>User Growth Chart</CardTitle>
        <CardDescription>No data available</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">No data available</p>
      </CardContent>
    </Card>
  )
}

export default GuideGrowth
