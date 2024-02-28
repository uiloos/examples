import { ModalComponentProps } from '../Modal/types';

type Props = {};

type CarModalResult = 'ford' | 'audi' | 'toyota';

export function CarModal(props: ModalComponentProps<Props, CarModalResult>) {
  function onCarClicked(car: CarModalResult) {
    props.view.dismiss(car);
  }

  return (
    <ol>
      <li>
        <button onClick={() => onCarClicked('ford')}>Ford</button>
      </li>
      <li>
        <button onClick={() => onCarClicked('audi')}>Audi</button>
      </li>
      <li>
        <button onClick={() => onCarClicked('toyota')}>Toyota</button>
      </li>
    </ol>
  );
}
