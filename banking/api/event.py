from django.http import Http404

from rest_framework import views, status, generics
from rest_framework.response import Response

from banking.models import Event
from banking.serializers.event import *


class EventListView(generics.ListCreateAPIView):
    model = Event
    serializer_class = EventFullSerializer
    queryset = Event.objects.all()

    def post(self, request):
        self.serializer_class = EventPostSerializer
        return super(EventListView, self).post(request)


class EventDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Event
    serializer_class = EventFullSerializer
    queryset = Event.objects.all()

    def put(self, request, pk):
        self.serializer_class = EventPostSerializer
        return super(EventDetail, self).put(request, pk)

    def patch(self, request, pk):
        self.serializer_class = EventPostSerializer
        return super(EventDetail, self).patch(request, pk)


class ParticipantListView(views.APIView):
    def get_event(self, pk):
        try:
            e = Event.objects.get(pk=pk)
            return e
        except Event.DoesNotExist:
            raise Http404

    def get(self, req, event_pk, format=None):
        e = self.get_event(event_pk)
        ps = ParticipationSerializer(e.get_participants(), many=True,
                                     context={'request': req})
        return Response(ps.data)

    def post(self, req, event_pk, format=None):
        """
        Expect array, like: [{"rate": 1, "account": 1}, ...]. Account contains
        pk.
        """
        ser = ParticipationPostSerializer(data=req.data,
                                          context={'request': req}, many=True)
        if ser.is_valid():
            newbies = {}
            for p in ser.validated_data:
                newbies.update({p['account']: p['rate']})
            print(newbies)
            e = self.get_event(event_pk)
            e.add_participants(newbies)
            return Response(ParticipationSerializer(e.get_participants()).data)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
