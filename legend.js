import {menu} from './menu'

export const legend = (
    selection,
    { title, optionsData, onChange, legendType }
  ) => {

    const container = selection
        .selectAll(`div.${title.value}`)
        .data([null])
        .join('div')
        .attr('class', title.value);

    
    container
        .selectAll('h3')
        .data([null])
        .join('h3')
        .text(title.label);
    
    container
        .call(legendType, {
            optionsData,
            onChange
        })
}