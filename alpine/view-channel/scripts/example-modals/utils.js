// Utility to make rendering modals with Alpine template syntax possible.
export function renderModal({ args: { modal, $el }, template, actions }) {
  // Generate a random id;
  const id = `modal-${Math.random()}`;

  setTimeout(() => {
    // After a timeout (so Alpine has time enough to render)
    // create a new div which has an x-data and which render the
    // content of the modal modal.
    $el.innerHTML = `
      <template id="${id}" x-data="{view: null, data: null, actions: null, show: false}" x-if="show">
        <div>
          ${template}
        </div>
      </template>
    `;

    // After another timeout the div will be initialized by Alpine.
    setTimeout(() => {
      const modalInstance = document.getElementById(id);

      const xData = modalInstance._x_dataStack[0];

      // Now for the hacky part, take the dataStack and manually
      // update the view and data, this way the provided "template'
      // can use view and data in the template.
      xData.view = modal;
      xData.data = modal.data.data;
      xData.actions = actions;

      // Finally it is ready to be shown
      xData.show = true;
    });
  });

  return modal.result;
}
