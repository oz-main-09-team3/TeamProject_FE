import React, { useEffect, useRef } from "react";
import { ColumnChart, NestedPieChart } from "@toast-ui/chart";
import "@toast-ui/chart/dist/toastui-chart.min.css";

function ChartPage() {
  const columnChartRef = useRef(null);
  const nestedPieChartRef = useRef(null);

  useEffect(() => {
    let columnChartInstance = null;
    let nestedPieChartInstance = null;

    const columnData = {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      series: [
        { name: "데이터 1", data: [40, 30, 45, 35, 25, 40] },
        { name: "데이터 2", data: [70, 60, 75, 65, 55, 70] },
      ],
    };

    const nestedPieData = {
      series: [
        {
          name: "Browser",
          data: [
            { name: "Chrome", data: 50 },
            { name: "Safari", data: 20 },
            { name: "Firefox", data: 15 },
            { name: "Edge", data: 10 },
            { name: "Others", data: 5 },
          ],
          children: {
            Chrome: [
              { name: "Chrome > 100", data: 25 },
              { name: "Chrome 80~100", data: 15 },
              { name: "Chrome 60~80", data: 10 },
            ],
            Safari: [
              { name: "Safari > 14", data: 12 },
              { name: "Safari 12~14", data: 8 },
            ],
            Firefox: [
              { name: "Firefox > 90", data: 10 },
              { name: "Firefox 80~90", data: 5 },
            ],
            Edge: [
              { name: "Edge > 100", data: 8 },
              { name: "Edge 80~100", data: 2 },
            ],
          },
        },
      ],
    };

    try {
      const columnOptions = {
        chart: {
          width: columnChartRef.current.clientWidth,
          height: 400,
          title: "월별 데이터",
        },
        series: { dataLabels: { visible: true } },
        legend: { visible: true },
      };

      const nestedPieOptions = {
        chart: {
          width: nestedPieChartRef.current.clientWidth,
          height: 400,
          title: "브라우저 사용량",
        },
        series: { dataLabels: { visible: true } },
        tooltip: { grouped: true },
        legend: { visible: true },
      };

      columnChartInstance = new ColumnChart({
        el: columnChartRef.current,
        data: columnData,
        options: columnOptions,
      });

      nestedPieChartInstance = new NestedPieChart({
        el: nestedPieChartRef.current,
        data: nestedPieData,
        options: nestedPieOptions,
      });
    } catch (error) {
      console.error("차트 초기화 오류:", error);
      console.error("오류 세부 정보:", error.stack);
    }

    const handleResize = () => {
      if (columnChartInstance && columnChartRef.current) {
        columnChartInstance.resize({
          width: columnChartRef.current.clientWidth,
          height: 400,
        });
      }
      if (nestedPieChartInstance && nestedPieChartRef.current) {
        nestedPieChartInstance.resize({
          width: nestedPieChartRef.current.clientWidth,
          height: 400,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (columnChartInstance) columnChartInstance.destroy();
      if (nestedPieChartInstance) nestedPieChartInstance.destroy();
    };
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-lg p-8">
        <div className="flex flex-wrap justify-center gap-8">
          <div className="w-full md:w-[45%]">
            <div ref={columnChartRef} className="w-full"></div>
          </div>
          <div className="w-full md:w-[45%]">
            <div ref={nestedPieChartRef} className="w-full"></div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ChartPage;
