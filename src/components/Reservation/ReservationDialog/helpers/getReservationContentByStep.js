import DEFAULT_STEPS from '../constants/defaultSteps'

const remapToObjectsByStepName = (stepsConfiguration) =>
    stepsConfiguration.reduce((acc, { component, step }) => (acc = { ...acc, [step]: component }), {})

/**
 * It returns the content for the current step of the reservation process
 * @param step - The current step of the reservation process.
 * @param stepsConfiguration - an object containing the content for each step of the reservation
 * process.
 * @returns The content of the step
 */
const getReservationContentByStep = (step, stepsConfiguration) => {
    const content = {
        ...remapToObjectsByStepName(stepsConfiguration),
        READY: DEFAULT_STEPS.ready.component,
        COMPLETED: DEFAULT_STEPS.completed.component,
        ERROR: DEFAULT_STEPS.error.component,
        default: DEFAULT_STEPS.default.component,
    }
    return content[step] ?? content['default']
}
export default getReservationContentByStep
