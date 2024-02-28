import { confirmDialog } from '../ConfirmationDialog/confirmation-service';
import { ModalComponentProps } from '../Modal/types';

type Props = {
  plea: string;
};

type PlanetModalResult = 'earth' | 'mars' | 'venus';

export function PlanetModal(
  props: ModalComponentProps<Props, PlanetModalResult>
) {
  async function destroy(planet: PlanetModalResult) {
    const confirmation = await confirmDialog(
      `Are you sure you want to destroy ${planet}`
    );

    if (confirmation) {
      props.view.dismiss(planet);
    }
  }

  return (
    <>
      <small>{props.plea}</small>

      <ol>
        <li>
          <button onClick={() => destroy('earth')}>Earth</button>
        </li>
        <li>
          <button onClick={() => destroy('mars')}>Mars</button>
        </li>
        <li>
          <button onClick={() => destroy('venus')}>Venus</button>
        </li>
      </ol>
    </>
  );
}
