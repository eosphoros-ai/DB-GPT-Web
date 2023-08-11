import React, { useRef } from "react";
import { Select, Option, Button, Table } from "@/lib/mui";
import BarChartIcon from '@mui/icons-material/BarChart';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import { Input, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { Chart, LineAdvance } from "bizcharts";
import MonacoEditor from './reactMonacoEditor';

const { Search } = Input;

const mockData = [
	{
		"name": "2023-01-01",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-01-03",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-01-04",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-01-10",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-01-13",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-01-15",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-01-16",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-01-17",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-01-18",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-01-20",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-01-22",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-01-23",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-01-24",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-01-25",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-01-29",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-01-31",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-02-01",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-02-02",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-02-06",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-02-07",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-02-09",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-02-11",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-02-12",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-02-13",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-02-14",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-02-18",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-02-21",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-02-22",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-02-23",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-02-25",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-03-01",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-03-05",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-03-06",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-03-12",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-03-14",
		"type": "order_count",
		"value": 3
	},
	{
		"name": "2023-03-15",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-03-16",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-03-18",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-03-20",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-03-23",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-03-25",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-03-26",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-03-27",
		"type": "order_count",
		"value": 3
	},
	{
		"name": "2023-03-29",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-03-31",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-04-03",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-04-05",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-04-07",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-04-10",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-04-14",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-04-16",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-04-18",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-04-20",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-04-24",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-04-26",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-04-27",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-04-28",
		"type": "order_count",
		"value": 4
	},
	{
		"name": "2023-04-29",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-04-30",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-05-02",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-05-05",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-05-13",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-05-14",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-05-18",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-05-28",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-06-06",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-06-11",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-06-14",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-06-15",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-06-17",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-06-20",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-06-23",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-06-26",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-06-28",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-06-29",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-07-06",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-07-07",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-07-08",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-07-15",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-07-21",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-07-22",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-07-23",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-07-24",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-07-25",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-07-27",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-07-29",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-07-30",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-08-02",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-08-05",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-08-06",
		"type": "order_count",
		"value": 4
	},
	{
		"name": "2023-08-07",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-08-09",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-08-13",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-08-15",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-08-17",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-08-22",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-08-27",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-08-29",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-08-30",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-09-02",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-09-03",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-09-06",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-09-07",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-09-09",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-09-10",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-09-12",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-09-13",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-09-16",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-09-19",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-09-22",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-09-23",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-09-25",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-09-28",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-09-29",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-09-30",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-10-01",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-10-04",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-10-07",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-10-10",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-10-13",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-10-16",
		"type": "order_count",
		"value": 3
	},
	{
		"name": "2023-10-20",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-10-22",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-10-23",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-10-24",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-10-29",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-10-30",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-11-02",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-11-06",
		"type": "order_count",
		"value": 3
	},
	{
		"name": "2023-11-07",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-11-08",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-11-18",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-11-19",
		"type": "order_count",
		"value": 3
	},
	{
		"name": "2023-11-20",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-11-21",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-11-22",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-11-24",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-11-30",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-12-01",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-12-02",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-12-03",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-12-05",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-12-07",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-12-09",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-12-12",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-12-13",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-12-17",
		"type": "order_count",
		"value": 2
	},
	{
		"name": "2023-12-18",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-12-20",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-12-23",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-12-25",
		"type": "order_count",
		"value": 3
	},
	{
		"name": "2023-12-30",
		"type": "order_count",
		"value": 1
	},
	{
		"name": "2023-01-01",
		"type": "total_sales",
		"value": 9546.48
	},
	{
		"name": "2023-01-03",
		"type": "total_sales",
		"value": 9557.01
	},
	{
		"name": "2023-01-04",
		"type": "total_sales",
		"value": 4170.54
	},
	{
		"name": "2023-01-10",
		"type": "total_sales",
		"value": 2365.21
	},
	{
		"name": "2023-01-13",
		"type": "total_sales",
		"value": 2264.09
	},
	{
		"name": "2023-01-15",
		"type": "total_sales",
		"value": 9063.43
	},
	{
		"name": "2023-01-16",
		"type": "total_sales",
		"value": 18237.96
	},
	{
		"name": "2023-01-17",
		"type": "total_sales",
		"value": 6396.23
	},
	{
		"name": "2023-01-18",
		"type": "total_sales",
		"value": 3208.07
	},
	{
		"name": "2023-01-20",
		"type": "total_sales",
		"value": 6928.52
	},
	{
		"name": "2023-01-22",
		"type": "total_sales",
		"value": 6606.78
	},
	{
		"name": "2023-01-23",
		"type": "total_sales",
		"value": 1892.35
	},
	{
		"name": "2023-01-24",
		"type": "total_sales",
		"value": 4330.57
	},
	{
		"name": "2023-01-25",
		"type": "total_sales",
		"value": 8399.99
	},
	{
		"name": "2023-01-29",
		"type": "total_sales",
		"value": 2170.07
	},
	{
		"name": "2023-01-31",
		"type": "total_sales",
		"value": 6655.04
	},
	{
		"name": "2023-02-01",
		"type": "total_sales",
		"value": 3541.47
	},
	{
		"name": "2023-02-02",
		"type": "total_sales",
		"value": 7821.2
	},
	{
		"name": "2023-02-06",
		"type": "total_sales",
		"value": 2855.54
	},
	{
		"name": "2023-02-07",
		"type": "total_sales",
		"value": 7624.26
	},
	{
		"name": "2023-02-09",
		"type": "total_sales",
		"value": 1978.67
	},
	{
		"name": "2023-02-11",
		"type": "total_sales",
		"value": 9477.29
	},
	{
		"name": "2023-02-12",
		"type": "total_sales",
		"value": 6168.61
	},
	{
		"name": "2023-02-13",
		"type": "total_sales",
		"value": 3192.47
	},
	{
		"name": "2023-02-14",
		"type": "total_sales",
		"value": 7874.62
	},
	{
		"name": "2023-02-18",
		"type": "total_sales",
		"value": 3178.54
	},
	{
		"name": "2023-02-21",
		"type": "total_sales",
		"value": 8608.87
	},
	{
		"name": "2023-02-22",
		"type": "total_sales",
		"value": 4557.74
	},
	{
		"name": "2023-02-23",
		"type": "total_sales",
		"value": 2184.72
	},
	{
		"name": "2023-02-25",
		"type": "total_sales",
		"value": 418.25
	},
	{
		"name": "2023-03-01",
		"type": "total_sales",
		"value": 1787.84
	},
	{
		"name": "2023-03-05",
		"type": "total_sales",
		"value": 7806.76
	},
	{
		"name": "2023-03-06",
		"type": "total_sales",
		"value": 4131.21
	},
	{
		"name": "2023-03-12",
		"type": "total_sales",
		"value": 2666.62
	},
	{
		"name": "2023-03-14",
		"type": "total_sales",
		"value": 20302.51
	},
	{
		"name": "2023-03-15",
		"type": "total_sales",
		"value": 15338.92
	},
	{
		"name": "2023-03-16",
		"type": "total_sales",
		"value": 4505.78
	},
	{
		"name": "2023-03-18",
		"type": "total_sales",
		"value": 12871.43
	},
	{
		"name": "2023-03-20",
		"type": "total_sales",
		"value": 8416.11
	},
	{
		"name": "2023-03-23",
		"type": "total_sales",
		"value": 9138.97
	},
	{
		"name": "2023-03-25",
		"type": "total_sales",
		"value": 4753.24
	},
	{
		"name": "2023-03-26",
		"type": "total_sales",
		"value": 10962.12
	},
	{
		"name": "2023-03-27",
		"type": "total_sales",
		"value": 22886.11
	},
	{
		"name": "2023-03-29",
		"type": "total_sales",
		"value": 7653.36
	},
	{
		"name": "2023-03-31",
		"type": "total_sales",
		"value": 8432.08
	},
	{
		"name": "2023-04-03",
		"type": "total_sales",
		"value": 5794.09
	},
	{
		"name": "2023-04-05",
		"type": "total_sales",
		"value": 9275.56
	},
	{
		"name": "2023-04-07",
		"type": "total_sales",
		"value": 8253.55
	},
	{
		"name": "2023-04-10",
		"type": "total_sales",
		"value": 7155.5
	},
	{
		"name": "2023-04-14",
		"type": "total_sales",
		"value": 971.5
	},
	{
		"name": "2023-04-16",
		"type": "total_sales",
		"value": 8662.47
	},
	{
		"name": "2023-04-18",
		"type": "total_sales",
		"value": 453.49
	},
	{
		"name": "2023-04-20",
		"type": "total_sales",
		"value": 7539.33
	},
	{
		"name": "2023-04-24",
		"type": "total_sales",
		"value": 4155.72
	},
	{
		"name": "2023-04-26",
		"type": "total_sales",
		"value": 3582.76
	},
	{
		"name": "2023-04-27",
		"type": "total_sales",
		"value": 5213.35
	},
	{
		"name": "2023-04-28",
		"type": "total_sales",
		"value": 22616.71
	},
	{
		"name": "2023-04-29",
		"type": "total_sales",
		"value": 9112.94
	},
	{
		"name": "2023-04-30",
		"type": "total_sales",
		"value": 6308.3
	},
	{
		"name": "2023-05-02",
		"type": "total_sales",
		"value": 6124.73
	},
	{
		"name": "2023-05-05",
		"type": "total_sales",
		"value": 7958.48
	},
	{
		"name": "2023-05-13",
		"type": "total_sales",
		"value": 1579.1
	},
	{
		"name": "2023-05-14",
		"type": "total_sales",
		"value": 5886.6
	},
	{
		"name": "2023-05-18",
		"type": "total_sales",
		"value": 1505.74
	},
	{
		"name": "2023-05-28",
		"type": "total_sales",
		"value": 10561.93
	},
	{
		"name": "2023-06-06",
		"type": "total_sales",
		"value": 5634.33
	},
	{
		"name": "2023-06-11",
		"type": "total_sales",
		"value": 4368.27
	},
	{
		"name": "2023-06-14",
		"type": "total_sales",
		"value": 6953.73
	},
	{
		"name": "2023-06-15",
		"type": "total_sales",
		"value": 7541.63
	},
	{
		"name": "2023-06-17",
		"type": "total_sales",
		"value": 3668.45
	},
	{
		"name": "2023-06-20",
		"type": "total_sales",
		"value": 434.43
	},
	{
		"name": "2023-06-23",
		"type": "total_sales",
		"value": 3366.5
	},
	{
		"name": "2023-06-26",
		"type": "total_sales",
		"value": 104.46
	},
	{
		"name": "2023-06-28",
		"type": "total_sales",
		"value": 7464.29
	},
	{
		"name": "2023-06-29",
		"type": "total_sales",
		"value": 16501.47
	},
	{
		"name": "2023-07-06",
		"type": "total_sales",
		"value": 3630.94
	},
	{
		"name": "2023-07-07",
		"type": "total_sales",
		"value": 1267.7
	},
	{
		"name": "2023-07-08",
		"type": "total_sales",
		"value": 11458.07
	},
	{
		"name": "2023-07-15",
		"type": "total_sales",
		"value": 9469.62
	},
	{
		"name": "2023-07-21",
		"type": "total_sales",
		"value": 489.65
	},
	{
		"name": "2023-07-22",
		"type": "total_sales",
		"value": 1133.11
	},
	{
		"name": "2023-07-23",
		"type": "total_sales",
		"value": 4257.86
	},
	{
		"name": "2023-07-24",
		"type": "total_sales",
		"value": 10624.74
	},
	{
		"name": "2023-07-25",
		"type": "total_sales",
		"value": 5242.69
	},
	{
		"name": "2023-07-27",
		"type": "total_sales",
		"value": 4720.95
	},
	{
		"name": "2023-07-29",
		"type": "total_sales",
		"value": 2420.1
	},
	{
		"name": "2023-07-30",
		"type": "total_sales",
		"value": 3667.2
	},
	{
		"name": "2023-08-02",
		"type": "total_sales",
		"value": 8984.04
	},
	{
		"name": "2023-08-05",
		"type": "total_sales",
		"value": 3288.42
	},
	{
		"name": "2023-08-06",
		"type": "total_sales",
		"value": 12357.21
	},
	{
		"name": "2023-08-07",
		"type": "total_sales",
		"value": 2833.54
	},
	{
		"name": "2023-08-09",
		"type": "total_sales",
		"value": 9050.19
	},
	{
		"name": "2023-08-13",
		"type": "total_sales",
		"value": 8507.81
	},
	{
		"name": "2023-08-15",
		"type": "total_sales",
		"value": 9227.36
	},
	{
		"name": "2023-08-17",
		"type": "total_sales",
		"value": 7715.38
	},
	{
		"name": "2023-08-22",
		"type": "total_sales",
		"value": 7139.5
	},
	{
		"name": "2023-08-27",
		"type": "total_sales",
		"value": 7476.81
	},
	{
		"name": "2023-08-29",
		"type": "total_sales",
		"value": 6493.63
	},
	{
		"name": "2023-08-30",
		"type": "total_sales",
		"value": 4014.04
	},
	{
		"name": "2023-09-02",
		"type": "total_sales",
		"value": 9528.7
	},
	{
		"name": "2023-09-03",
		"type": "total_sales",
		"value": 8367.96
	},
	{
		"name": "2023-09-06",
		"type": "total_sales",
		"value": 7592.88
	},
	{
		"name": "2023-09-07",
		"type": "total_sales",
		"value": 2895.6
	},
	{
		"name": "2023-09-09",
		"type": "total_sales",
		"value": 6950.99
	},
	{
		"name": "2023-09-10",
		"type": "total_sales",
		"value": 687.85
	},
	{
		"name": "2023-09-12",
		"type": "total_sales",
		"value": 8489.96
	},
	{
		"name": "2023-09-13",
		"type": "total_sales",
		"value": 8289.82
	},
	{
		"name": "2023-09-16",
		"type": "total_sales",
		"value": 14531.83
	},
	{
		"name": "2023-09-19",
		"type": "total_sales",
		"value": 1593.61
	},
	{
		"name": "2023-09-22",
		"type": "total_sales",
		"value": 5124.64
	},
	{
		"name": "2023-09-23",
		"type": "total_sales",
		"value": 4733.21
	},
	{
		"name": "2023-09-25",
		"type": "total_sales",
		"value": 14357.61
	},
	{
		"name": "2023-09-28",
		"type": "total_sales",
		"value": 4591.95
	},
	{
		"name": "2023-09-29",
		"type": "total_sales",
		"value": 4360.01
	},
	{
		"name": "2023-09-30",
		"type": "total_sales",
		"value": 2506.12
	},
	{
		"name": "2023-10-01",
		"type": "total_sales",
		"value": 4546.27
	},
	{
		"name": "2023-10-04",
		"type": "total_sales",
		"value": 1721.35
	},
	{
		"name": "2023-10-07",
		"type": "total_sales",
		"value": 9834.72
	},
	{
		"name": "2023-10-10",
		"type": "total_sales",
		"value": 8107.94
	},
	{
		"name": "2023-10-13",
		"type": "total_sales",
		"value": 1487.48
	},
	{
		"name": "2023-10-16",
		"type": "total_sales",
		"value": 7818.92
	},
	{
		"name": "2023-10-20",
		"type": "total_sales",
		"value": 8454.85
	},
	{
		"name": "2023-10-22",
		"type": "total_sales",
		"value": 5266.9
	},
	{
		"name": "2023-10-23",
		"type": "total_sales",
		"value": 7160.58
	},
	{
		"name": "2023-10-24",
		"type": "total_sales",
		"value": 566.96
	},
	{
		"name": "2023-10-29",
		"type": "total_sales",
		"value": 7038.3
	},
	{
		"name": "2023-10-30",
		"type": "total_sales",
		"value": 732.62
	},
	{
		"name": "2023-11-02",
		"type": "total_sales",
		"value": 7624.69
	},
	{
		"name": "2023-11-06",
		"type": "total_sales",
		"value": 5257.43
	},
	{
		"name": "2023-11-07",
		"type": "total_sales",
		"value": 4977.29
	},
	{
		"name": "2023-11-08",
		"type": "total_sales",
		"value": 7551.79
	},
	{
		"name": "2023-11-18",
		"type": "total_sales",
		"value": 5977.08
	},
	{
		"name": "2023-11-19",
		"type": "total_sales",
		"value": 19850.41
	},
	{
		"name": "2023-11-20",
		"type": "total_sales",
		"value": 7748.86
	},
	{
		"name": "2023-11-21",
		"type": "total_sales",
		"value": 1250.59
	},
	{
		"name": "2023-11-22",
		"type": "total_sales",
		"value": 5947.1
	},
	{
		"name": "2023-11-24",
		"type": "total_sales",
		"value": 7402.42
	},
	{
		"name": "2023-11-30",
		"type": "total_sales",
		"value": 8996.64
	},
	{
		"name": "2023-12-01",
		"type": "total_sales",
		"value": 3280.24
	},
	{
		"name": "2023-12-02",
		"type": "total_sales",
		"value": 7312.57
	},
	{
		"name": "2023-12-03",
		"type": "total_sales",
		"value": 2205.06
	},
	{
		"name": "2023-12-05",
		"type": "total_sales",
		"value": 16321.01
	},
	{
		"name": "2023-12-07",
		"type": "total_sales",
		"value": 1588.64
	},
	{
		"name": "2023-12-09",
		"type": "total_sales",
		"value": 8408.58
	},
	{
		"name": "2023-12-12",
		"type": "total_sales",
		"value": 3118.95
	},
	{
		"name": "2023-12-13",
		"type": "total_sales",
		"value": 11259.02
	},
	{
		"name": "2023-12-17",
		"type": "total_sales",
		"value": 8062.74
	},
	{
		"name": "2023-12-18",
		"type": "total_sales",
		"value": 5302.87
	},
	{
		"name": "2023-12-20",
		"type": "total_sales",
		"value": 2621.46
	},
	{
		"name": "2023-12-23",
		"type": "total_sales",
		"value": 4968.25
	},
	{
		"name": "2023-12-25",
		"type": "total_sales",
		"value": 13804.1
	},
	{
		"name": "2023-12-30",
		"type": "total_sales",
		"value": 8858.86
	}
];

function DbEditor() {
	const [expandedKeys, setExpandedKeys] = React.useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [autoExpandParent, setAutoExpandParent] = React.useState(true);
	const [charVisible, setChartVisible] = React.useState(false);
	const [editorValue, setEditorValue] = React.useState('select \n c.name,\n count(*) as qyery_count\nfrom\n queries q join connections c on q.connection_id = c.id\ngroup by\n c.name\norder by\n c.name');
	const defaultData: DataNode[] = [{
		title: 'main',
		key: 'main',
		children: [{
			title: 'schema_version',
			key: 'schema_version',
			children: [{
				title: 'id',
				key: 'schema_version_id'
			}, {
				title: 'name',
				key: 'schema_version_name'
			}, {
				title: 'description',
				key: 'schema_version_description'
			}, {
				title: 'driver',
				key: 'schema_version_driver'
			}]
		}, {
			title: 'sqlite_sequence',
			key: 'sqlite_sequence',
			children: [{
				title: 'id',
				key: 'sqlite_sequence_id'
			}]
		}, {
			title: 'service_tokens',
			key: 'service_tokens',
			children: [{
				title: 'data',
				key: 'service_tokens_data'
			}]
		}, {
			title: 'queries',
			key: 'queries',
			children: [{
				title: 'idle',
				key: 'queries_idle'
			}]
		}]
	}];
	const editorRef = useRef(null);
	const dataList: { key: React.Key; title: string }[] = [];
	const generateList = (data: DataNode[]) => {
		for (let i = 0; i < data.length; i++) {
			const node = data[i];
			const { key } = node;
			dataList.push({ key, title: key as string });
			if (node.children) {
				generateList(node.children);
			}
		}
	};
	generateList(defaultData);

	const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
		let parentKey: React.Key;
		for (let i = 0; i < tree.length; i++) {
			const node = tree[i];
			if (node.children) {
				if (node.children.some((item) => item.key === key)) {
					parentKey = node.key;
				} else if (getParentKey(key, node.children)) {
					parentKey = getParentKey(key, node.children);
				}
			}
		}
		return parentKey!;
	};


	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newExpandedKeys = dataList
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, defaultData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(newExpandedKeys as React.Key[]);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

	const treeData = React.useMemo(() => {
    const loop = (data: DataNode[]): DataNode[] =>
      data.map((item) => {
        const strTitle = item.title as string;
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="text-[#1677ff]">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }

        return {
          title,
          key: item.key,
        };
      });

    return loop(defaultData);
  }, [searchValue]);

  return (
		<div className="flex flex-col w-full h-full">
			<div className='bg-[#f8f8f8] border-[var(--joy-palette-divider)] border-b border-solid flex items-center px-3 justify-between'>
				<div className="flex items-center py-3">
					<AutoAwesomeMotionIcon className="mr-2" />
					<Select defaultValue="dog" className="h-4 w-60" size="sm">
						<Option value="dog">Dog</Option>
						<Option value="cat">Cat</Option>
					</Select>
				</div>
				<div>
					<Button
						className="bg-[#1677ff] text-[#fff] hover:bg-[#1c558e]"
						onClick={() => {
							setTimeout(() => {
								setChartVisible(!charVisible);
							}, 0);
							setTimeout(() => {
								if (editorRef?.current) {
									editorRef.current?.layout?.();
								}
							}, 100)
						}}
					>
						Run
					</Button>
					<Button variant="outlined" className="ml-3">Save</Button>
					<BarChartIcon className="ml-3 text-[#1677ff] cursor-pointer" />
				</div>
			</div>
			<div className="flex flex-1">
				<div className="text h-full border-[var(--joy-palette-divider)] border-r border-solid p-3" style={{ width: '288px' }}>
					<Search
						style={{ marginBottom: 8 }}
						placeholder="Search"
						onChange={onChange}
					/>
					<Tree
						onExpand={(newExpandedKeys: React.Key[]) => {
							setExpandedKeys(newExpandedKeys);
							setAutoExpandParent(false);
						}}
						expandedKeys={expandedKeys}
						autoExpandParent={autoExpandParent}
						treeData={treeData}
					/>
				</div>				
				<div className="flex flex-col flex-1 max-w-full overflow-hidden">
					<div className="flex-1 flex">
						<div className="flex-1" style={{ flexShrink: 0, overflow: 'hidden' }}>
							<MonacoEditor
								value={editorValue}
								language="mysql"
								onChange={(value) => {
									console.log(value);
								}}
								editorInstanceRef={(ins) => {
									editorRef.current = ins
								}}
							/>
						</div>
						{charVisible && (
							<div className="flex-1 overflow-hidden p-3">
								<Chart
									autoFit
									data={mockData}
								>
									<LineAdvance
										shape="smooth"
										point
										area
										position="name*value"
										color="type"
									/>
								</Chart>
							</div>
						)}
					</div>
					<div className="h-60 border-[var(--joy-palette-divider)] border-t border-solid overflow-auto">
						<Table aria-label="basic table" stickyHeader>
							<thead>
								<tr>
									<th style={{ width: '40%' }}>Dessert (100g serving)</th>
									<th>Calories</th>
									<th>Fat&nbsp;(g)</th>
									<th>Carbs&nbsp;(g)</th>
									<th>Protein&nbsp;(g)</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>Frozen yoghurt</td>
									<td>159</td>
									<td>6</td>
									<td>24</td>
									<td>4</td>
								</tr>
								<tr>
									<td>Frozen yoghurt</td>
									<td>159</td>
									<td>6</td>
									<td>24</td>
									<td>4</td>
								</tr>
								<tr>
									<td>Frozen yoghurt</td>
									<td>159</td>
									<td>6</td>
									<td>24</td>
									<td>4</td>
								</tr>
								<tr>
									<td>Ice cream sandwich</td>
									<td>237</td>
									<td>9</td>
									<td>37</td>
									<td>4.3</td>
								</tr>
								<tr>
									<td>Eclair</td>
									<td>262</td>
									<td>16</td>
									<td>24</td>
									<td>6</td>
								</tr>
								<tr>
									<td>Cupcake</td>
									<td>305</td>
									<td>3.7</td>
									<td>67</td>
									<td>4.3</td>
								</tr>
								<tr>
									<td>Gingerbread</td>
									<td>356</td>
									<td>16</td>
									<td>49</td>
									<td>3.9</td>
								</tr>
							</tbody>
						</Table>
					</div>
				</div>
			</div>
		</div>
	)
}

export default DbEditor;