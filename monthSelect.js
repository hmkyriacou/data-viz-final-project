import {select, create} from 'd3'

export const monthSelect = (
    selection,
    { optionsData, onChange, value }
  ) => {
    
    for (const option of optionsData) {
        selection
            .selectAll(`input.${option.value}`)
            .data([null])
            .join('input')
            .attr('class', option.value)
            .attr('type', 'checkbox')
            .attr('id', option.value)
            .attr('name', 'monthSelect')
            .attr('value', option.value)
            .on('change', (event) => {

                const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked')
                const values = [];
                checkboxes.forEach((checkbox) => {
                    values.push(checkbox.value);
                 });
                 onChange(values)
            })

        selection
            .selectAll(`label.${option.value}`)
            .data([null])
            .join('label')
            .attr('class', option.value)
            .attr('for', option.value)
            .text(option.label)
    }

    

  };