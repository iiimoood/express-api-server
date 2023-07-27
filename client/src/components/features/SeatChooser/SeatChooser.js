import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Progress, Alert } from 'reactstrap';
import {
  getSeats,
  getRequests,
  loadSeats,
  loadSeatsRequest,
} from '../../../redux/seatsRedux';
import './SeatChooser.scss';
import io from 'socket.io-client';

const SeatChooser = ({ chosenDay, chosenSeat, updateSeat }) => {
  const seats = useSelector(getSeats);
  const requests = useSelector(getRequests);
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const [allSeats] = useState(50);

  useEffect(() => {
    dispatch(loadSeatsRequest());
    const correctSocket = io(
      process.env.NODE_ENV === 'production'
        ? '/'
        : ('ws://localhost:8000', { transports: ['websocket'] })
    );
    setSocket(correctSocket);

    correctSocket.on('seatsUpdated', (seats) => dispatch(loadSeats(seats)));
  }, [dispatch]);

  const isTaken = (seatId) => {
    return seats.some((item) => item.seat === seatId && item.day === chosenDay);
  };

  const calculateFreeSeats = () =>
    allSeats - seats.filter((item) => item.day === chosenDay).length;

  const prepareSeat = (seatId) => {
    if (seatId === chosenSeat)
      return (
        <Button key={seatId} className="seats__seat" color="primary">
          {seatId}
        </Button>
      );
    else if (isTaken(seatId))
      return (
        <Button key={seatId} className="seats__seat" disabled color="secondary">
          {seatId}
        </Button>
      );
    else
      return (
        <Button
          key={seatId}
          color="primary"
          className="seats__seat"
          outline
          onClick={(e) => updateSeat(e, seatId)}
        >
          {seatId}
        </Button>
      );
  };

  return (
    <div>
      <h3>Pick a seat</h3>
      <small id="pickHelp" className="form-text text-muted ml-2">
        <Button color="secondary" /> – seat is already taken
      </small>
      <small id="pickHelpTwo" className="form-text text-muted ml-2 mb-4">
        <Button outline color="primary" /> – it's empty
      </small>
      {requests['LOAD_SEATS'] && requests['LOAD_SEATS'].success && (
        <div className="seats">
          {[...Array(allSeats)].map((x, i) => prepareSeat(i + 1))}
        </div>
      )}
      {requests['LOAD_SEATS'] && requests['LOAD_SEATS'].pending && (
        <Progress animated color="primary" value={50} />
      )}
      {requests['LOAD_SEATS'] && requests['LOAD_SEATS'].error && (
        <Alert color="warning">Couldn't load seats...</Alert>
      )}
      <p>
        Free seats: {calculateFreeSeats()} / {allSeats}{' '}
      </p>
    </div>
  );
};

export default SeatChooser;
