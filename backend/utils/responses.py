from rest_framework.response import Response


def responseSuccess(data, status_code=200, message=''):
    """
    Standardized success response format
    
    Args:
        data: Response data (dict, list, or any serializable object)
        status_code: HTTP status code (default: 200)
        message: Optional success message
    
    Returns:
        Response object with standardized format
    """
    response_data = {
        'success': True,
        'data': data
    }
    
    if message:
        response_data['message'] = message
        
    return Response(response_data, status=status_code)


def responseError(message, status_code=400, errors=None):
    """
    Standardized error response format
    
    Args:
        message: Error message
        status_code: HTTP status code (default: 400)
        errors: Optional detailed errors (for validation errors)
    
    Returns:
        Response object with standardized error format
    """
    response_data = {
        'success': False,
        'message': message
    }
    
    if errors:
        response_data['errors'] = errors
        
    return Response(response_data, status=status_code)