# LineSeries Plugin Reference

The LineSeries plugin visualizes the line series.

## Import

Use the following statement to import the plugin:

```js
import { LineSeries } from '@devexpress/dx-react-chart-material-ui';
// import { LineSeries } from '@devexpress/dx-react-chart-bootstrap4';
```

If you want to use custom components, you can import the themeless plugin:

```js
import { LineSeries } from '@devexpress/dx-react-chart';
```

## User Reference

### Properties

Name | Type | Default | Description
-----|------|---------|------------
name | string | | A series name.
valueField | string | | The name of a data field that provides series point values.
argumentField | string | | The name of a data field that provides series point argument values.
axisName? | string | | The associated axis.
stack? | string | | The associated stack.
color? | string | | A series color.
seriesComponent | ComponentType&lt;[LineSeries.SeriesProps](#lineseriesseriesprops)&gt; | | A component that renders the series.

## Interfaces

### LineSeries.SeriesProps

Describes properties passed to a component that renders the series.

Field | Type | Description
------|------|------------
coordinates | Array&lt;{ x: number, y: number }&gt; | Coordinates of the series' points.
path | (coordinates: Array&lt;any&gt;) => string | A function used to calculate the series' path.
color | string | A series color.
style | object | Series styles.

## Plugin Components

Name | Properties | Description
-----|------------|------------
LineSeries.Path | [LineSeries.SeriesProps](#lineseriesseriesprops) | A component that renders the series.
