import LayerSVG from '@/shared/assets/icons/layers-bootstrap.svg'
import FilterSVG from '@/shared/assets/icons/funnel-bootstrap.svg'
import StatisticsSVG from '@/shared/assets/icons/bar-chart-bootstrap.svg'
import AnalysisSVG from '@/shared/assets/icons/clipboard2-pulse-bootstrap.svg'

export const PANEL_THEMES = Object.freeze({
  layers: {
    id: 'layers',
    title: 'Layers',
    svg: LayerSVG
  },
  filter: {
    id: 'filter',
    title: 'Filter',
    svg: FilterSVG
  },
  statistics: {
    id: 'statistics',
    title: 'Statistics',
    svg: StatisticsSVG
  },
  analysis: {
    id: 'analysis',
    title: 'Analysis',
    svg: AnalysisSVG
  }
})
