import PropTypes from 'prop-types';

import { Navbar } from './components/Navbar/Navbar';
import { Body } from './components/Body/Body';
import { LabelModalContainer } from './containers/LabelModalContainer';

/**
 * React Stateless Functional Component. Renders the application's main
 * components: Navbar, Body and LabelModal.
 *
 * @param {Object} props - The React props passed down from the parent
 * component
 */
export const App = (props) => (
  <div>
    <Navbar
      onShowTextClick={props.onShowTextClick}
      onLabelUncertainClick={props.onLabelUncertainClick}
      showText={props.showText}
      onLabelSelectedClick={props.onLabelSelectedClick}
      onResetData={props.onResetData}
    />
    <Body
      docs={props.docs}
      activeDoc={props.activeDoc}
      onDocChange={props.onDocChange}
      showText={props.showText}
      loading={props.loading}
      labelledDocs={props.labelledDocs}
      predictions={props.predictions}
      docsToLabel={props.docsToLabel}
      onLabelSelectedClick={props.onLabelSelectedClick}
      labels={props.labels}
    />
    <LabelModalContainer
      docs={props.docs}
      activeDoc={props.repeatModal ? null : props.activeDoc}
      showModal={props.showModal}
      onHideModal={props.onHideModal}
      loading={props.loading}
      onSendLabels={props.onSendLabels}
      labelledDocs={props.labelledDocs}
      docsToLabel={props.docsToLabel}
      labels={props.labels}
      repeatModal={props.repeatModal}
    />
  </div>
);

// React PropTypes object
App.propTypes = {
  onShowTextClick: PropTypes.func.isRequired,
  onLabelUncertainClick: PropTypes.func.isRequired,
  onHideModal: PropTypes.func.isRequired,
  showText: PropTypes.bool.isRequired,
  showModal: PropTypes.bool.isRequired,
  docs: PropTypes.object,
  activeDoc: PropTypes.string,
  onDocChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  onSendLabels: PropTypes.func.isRequired,
  labelledDocs: PropTypes.object,
  predictions: PropTypes.object,
  docsToLabel: PropTypes.array,
  onLabelSelectedClick: PropTypes.func.isRequired,
  labels: PropTypes.array,
  repeatModal: PropTypes.bool.isRequired,
  onResetData: PropTypes.func.isRequired,
};
