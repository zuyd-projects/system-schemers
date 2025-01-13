import unittest
from unittest.mock import patch, MagicMock
from producer import send_to_broker

class TestProducer(unittest.TestCase):
    @patch('producer.pika.BlockingConnection')  # Mock RabbitMQ connection
    def test_send_to_broker(self, mock_connection):
        # Set up the mock
        mock_channel = MagicMock()
        mock_connection.return_value.channel.return_value = mock_channel

        message = {"event_type": "test_event", "payload": {"text": "Test"}}

        try:
            # Call the function
            send_to_broker(message)

            # Assert that basic_publish was called with correct arguments
            mock_channel.basic_publish.assert_called_with(
                exchange='',
                routing_key='hello',  # Ensure this matches your queue name in the actual function
                body='{"event_type": "test_event", "payload": {"text": "Test"}}'
            )
        except Exception as e:
            self.fail(f"send_to_broker raised an exception: {e}")

if __name__ == '__main__':
    unittest.main()