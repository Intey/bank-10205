from rest_framework import generics, status
from rest_framework.response import Response

from backend.models import Group
from .serializers import GroupSerializer, GroupPostSerializer


class GroupListView(generics.ListCreateAPIView):
    """ Show groups of users. """
    model = Group
    serializer_class = GroupSerializer
    queryset = Group.objects.prefetch_related('participants')

    def post(self, request, *args, **kwargs):
        ser = GroupPostSerializer(data=request.data)
        if ser.is_valid():
            group = ser.create(ser.validated_data)
            serializer = GroupSerializer(group,
                                         context={"request": request})
            response_data = serializer.data
            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)


class GroupDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Show concrete group and ide ability to change it's participants
    """
    model = Group
    serializer_class = GroupSerializer

    def patch(self, request, pk):
        self.serializer_class = GroupPostSerializer
        return super(GroupDetailView, self).patch(request, pk)
